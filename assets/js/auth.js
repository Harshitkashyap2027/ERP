// ============================================
// UNIBOLT ERP — AUTHENTICATION MODULE
// Handles login, register, logout, session mgmt
// ============================================

const ERPAuth = (() => {
  // ── State ─────────────────────────────────
  let currentUser = null;
  let authListeners = [];

  // ── Initialise ────────────────────────────
  function init() {
    if (!auth) return;
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        currentUser = await enrichUser(user);
        ERPState.setUser(currentUser);
        notifyListeners(currentUser);
        ERPRouter.redirectAfterLogin();
      } else {
        currentUser = null;
        ERPState.clearUser();
        notifyListeners(null);
        ERPRouter.redirectToLogin();
      }
    });
  }

  // ── Enrich user with Firestore profile ───
  async function enrichUser(firebaseUser) {
    try {
      const snap = await db.collection('users').doc(firebaseUser.uid).get();
      const profile = snap.exists ? snap.data() : {};
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        displayName: firebaseUser.displayName || profile.name || 'User',
        photoURL: firebaseUser.photoURL || profile.photoURL || null,
        role: profile.role || 'student',
        department: profile.department || null,
        rollNumber: profile.rollNumber || null,
        employeeId: profile.employeeId || null,
        permissions: profile.permissions || [],
        createdAt: profile.createdAt || null,
        lastLogin: new Date().toISOString(),
      };
    } catch (err) {
      console.error('UniBolt Auth: Failed to enrich user', err);
      return { uid: firebaseUser.uid, email: firebaseUser.email, role: 'student' };
    }
  }

  // ── Login with email/password ─────────────
  async function login(email, password) {
    try {
      showLoader('Signing you in…');
      const result = await auth.signInWithEmailAndPassword(email, password);
      // Update last login timestamp
      await db.collection('users').doc(result.user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
      hideLoader();
      ERPToast.show('Welcome back! 👋', 'success');
      return { success: true, user: result.user };
    } catch (err) {
      hideLoader();
      const msg = getAuthErrorMessage(err.code);
      ERPToast.show(msg, 'error');
      return { success: false, error: err.code };
    }
  }

  // ── Register new account ──────────────────
  async function register(data) {
    try {
      showLoader('Creating your account…');
      const result = await auth.createUserWithEmailAndPassword(data.email, data.password);
      // Update display name
      await result.user.updateProfile({ displayName: data.name });
      // Create Firestore user document
      await db.collection('users').doc(result.user.uid).set({
        name: data.name,
        email: data.email,
        role: data.role || 'student',
        department: data.department || null,
        rollNumber: data.rollNumber || null,
        employeeId: data.employeeId || null,
        permissions: [],
        status: 'active',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // Send verification email
      await result.user.sendEmailVerification();
      hideLoader();
      ERPToast.show('Account created! Please verify your email.', 'success');
      return { success: true };
    } catch (err) {
      hideLoader();
      const msg = getAuthErrorMessage(err.code);
      ERPToast.show(msg, 'error');
      return { success: false, error: err.code };
    }
  }

  // ── Logout ────────────────────────────────
  async function logout() {
    try {
      await auth.signOut();
      ERPToast.show('Signed out successfully.', 'info');
    } catch (err) {
      ERPToast.show('Sign-out failed. Please try again.', 'error');
    }
  }

  // ── Password reset ────────────────────────
  async function sendPasswordReset(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      ERPToast.show('Password reset email sent!', 'success');
      return { success: true };
    } catch (err) {
      ERPToast.show(getAuthErrorMessage(err.code), 'error');
      return { success: false };
    }
  }

  // ── Google SSO ────────────────────────────
  async function loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      // Check if new user — create profile if needed
      const snap = await db.collection('users').doc(result.user.uid).get();
      if (!snap.exists) {
        await db.collection('users').doc(result.user.uid).set({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          role: 'student',
          permissions: [],
          status: 'active',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      ERPToast.show('Signed in with Google!', 'success');
      return { success: true };
    } catch (err) {
      ERPToast.show(getAuthErrorMessage(err.code), 'error');
      return { success: false };
    }
  }

  // ── Helpers ───────────────────────────────
  function getAuthErrorMessage(code) {
    const messages = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/popup-closed-by-user': 'Sign-in cancelled.',
    };
    return messages[code] || 'Something went wrong. Please try again.';
  }

  function getCurrentUser() { return currentUser; }
  function isAuthenticated() { return currentUser !== null; }
  function hasRole(role) { return currentUser && currentUser.role === role; }
  function hasPermission(perm) { return currentUser && currentUser.permissions.includes(perm); }
  function isAdmin() { return hasRole('admin') || hasRole('super_admin'); }

  function onAuthChange(fn) { authListeners.push(fn); }
  function notifyListeners(user) { authListeners.forEach(fn => fn(user)); }

  function showLoader(msg) { ERPLoader.show(msg); }
  function hideLoader() { ERPLoader.hide(); }

  return {
    init,
    login,
    register,
    logout,
    sendPasswordReset,
    loginWithGoogle,
    getCurrentUser,
    isAuthenticated,
    hasRole,
    hasPermission,
    isAdmin,
    onAuthChange,
  };
})();
