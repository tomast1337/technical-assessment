import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { env } from '@config/index';
import { UserModel } from '@models/index';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }),
);

export default passport;
