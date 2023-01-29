import { injectable } from 'inversify';
import session from 'express-session';
import createMemoryStore from 'memorystore';
@injectable()
export class SessionManager {
  private readonly SESSION_SECRET = 'onyNYFAg2ItI8TcgBzraonyNYFAg2ItI8TcgBzra';
  session: ReturnType<typeof session>;
  constructor() {
    const MemoryStore = createMemoryStore(session);
    this.session = session({
      secret: this.SESSION_SECRET,
      saveUninitialized: true,
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    });
  }
}
