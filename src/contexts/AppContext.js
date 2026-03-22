import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  theme: localStorage.getItem('artvision-theme') || 'light',
  isLoading: false,
  error: null,
  preferences: {
    animations: true,
    autoSave: true,
    notifications: true
  }
};

// Action types
const actionTypes = {
  SET_USER: 'SET_USER',
  SET_THEME: 'SET_THEME',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  LOGOUT: 'LOGOUT'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload, error: null };
    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case actionTypes.UPDATE_PREFERENCES:
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      };
    case actionTypes.LOGOUT:
      return { ...initialState, theme: state.theme }; // Keep theme preference
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.body.className = state.theme;
  }, [state.theme]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('artvision-theme');
    const savedPreferences = localStorage.getItem('artvision-preferences');
    
    if (savedTheme && savedTheme !== state.theme) {
      dispatch({ type: actionTypes.SET_THEME, payload: savedTheme });
    }
    
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: actionTypes.UPDATE_PREFERENCES, payload: preferences });
      } catch (error) {
        console.error('Failed to parse preferences:', error);
      }
    }
  }, [state.theme]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('artvision-theme', state.theme);
    localStorage.setItem('artvision-preferences', JSON.stringify(state.preferences));
  }, [state.theme, state.preferences]);

  // Action creators
  const actions = {
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    setTheme: (theme) => dispatch({ type: actionTypes.SET_THEME, payload: theme }),
    setLoading: (isLoading) => dispatch({ type: actionTypes.SET_LOADING, payload: isLoading }),
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: actionTypes.CLEAR_ERROR }),
    updatePreferences: (preferences) => dispatch({ type: actionTypes.UPDATE_PREFERENCES, payload: preferences }),
    logout: () => dispatch({ type: actionTypes.LOGOUT })
  };

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    actions.setTheme(newTheme);
  };

  const value = {
    ...state,
    ...actions,
    toggleTheme,
    isDarkMode: state.theme === 'dark',
    isLightMode: state.theme === 'light'
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { actionTypes };
