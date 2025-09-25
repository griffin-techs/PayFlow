// Simple JWT-like authentication service using localStorage
class AuthService {
  constructor() {
    this.storageKey = 'payflow_auth';
    this.usersKey = 'payflow_users';
  }

  // Initialize users storage if it doesn't exist
  initializeUsers() {
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify([]));
    }
  }

  // Generate a simple token (in production, use proper JWT)
  generateToken(userId) {
    const payload = {
      userId,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    return btoa(JSON.stringify(payload));
  }

  // Verify token
  verifyToken(token) {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        return null; // Token expired
      }
      return payload;
    } catch {
      return null;
    }
  }

  // Get all users
  getUsers() {
    this.initializeUsers();
    return JSON.parse(localStorage.getItem(this.usersKey)) || [];
  }

  // Save users
  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // Register new user
  async register(name, email, password) {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return { success: false, error: 'User already exists with this email' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: btoa(password), // Simple encoding (use proper hashing in production)
      createdAt: new Date().toISOString(),
      profile: {
        company: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        avatar: ''
      }
    };

    users.push(newUser);
    this.saveUsers(users);

    // Generate token and save session
    const token = this.generateToken(newUser.id);
    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      profile: newUser.profile,
      token
    };

    localStorage.setItem(this.storageKey, JSON.stringify(userSession));

    return { success: true, user: userSession };
  }

  // Login user
  async login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === btoa(password));

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Generate token and save session
    const token = this.generateToken(user.id);
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token
    };

    localStorage.setItem(this.storageKey, JSON.stringify(userSession));

    return { success: true, user: userSession };
  }

  // Get current user
  getCurrentUser() {
    const sessionData = localStorage.getItem(this.storageKey);
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData);
      const tokenPayload = this.verifyToken(session.token);
      
      if (!tokenPayload) {
        this.logout(); // Clear invalid session
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      name: profileData.name || users[userIndex].name,
      profile: {
        ...users[userIndex].profile,
        ...profileData.profile
      }
    };

    this.saveUsers(users);

    // Update session
    const updatedSession = {
      ...currentUser,
      name: users[userIndex].name,
      profile: users[userIndex].profile
    };

    localStorage.setItem(this.storageKey, JSON.stringify(updatedSession));

    return { success: true, user: updatedSession };
  }

  // Logout
  logout() {
    localStorage.removeItem(this.storageKey);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();