const isSignedIn = (req, res, next) => {
    // If the user is authenticated, then the session (req.session) will have a user object defined on it
    // If the user obeject is defined, execute the next middleware that allows the request to proceed to the route handler
    if (req.session.user) return next()
    
    // If the req.session.user key was undefined, the user is not authenticated, end the request by redirecting them to the sign in page
    return res.redirect('/auth/sign-in')
  }
  
  module.exports = isSignedIn
  