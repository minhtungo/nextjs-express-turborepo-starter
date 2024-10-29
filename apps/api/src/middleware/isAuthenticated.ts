import passport from "passport";

const isAuthenticated = passport.authenticate("jwt", { session: false });

export default isAuthenticated;
