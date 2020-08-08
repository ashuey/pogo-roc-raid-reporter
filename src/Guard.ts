import * as queryString from 'query-string';
import * as jwt from 'jsonwebtoken'
import Cookies from "js-cookie";

const COOKIE_NAME = 'pogoroc_jwt';

interface User {
    id: string;
    username: string;
    discriminator: string;
    serverMember: boolean;
}

export default class Guard {
    protected jwt_?: string;

    protected user_?: User;

    constructor() {
        if (this.checkForURLToken()) {
            return;
        }

        this.checkForCookieToken();
    }

    public check(): boolean {
        return !!this.user();
    }

    public guest(): boolean {
        return !this.check();
    }

    public user(): User | null {
        return this.user_ ?? null;
    }

    public jwt(): string | null {
        return this.jwt_ ?? null;
    }

    public logout(): void {
        this.user_ = undefined;
        this.jwt_ = undefined;
        Cookies.remove(COOKIE_NAME);
    }

    protected checkForURLToken(): boolean {
        const parsed = queryString.parse(location.search);

        if (!('token' in parsed && typeof parsed.token === 'string')) {
            return false;
        }

        history.pushState(null, "", location.href.split("?")[0]);

        const token = parsed.token;

        if (!this.verifyAndSetToken(token)) {
            return false;
        }

        this.saveTokenToCookie(token);

        return true;
    }

    protected verifyAndSetToken(token: string): boolean {
        const payload = jwt.decode(token);

        if (!payload || typeof payload !== 'object') {
            return false;
        }

        // Check for expired token
        const now = Math.floor(Date.now() / 1000);

        if ('exp' in payload && payload.exp <= now) {
            return false;
        }

        this.jwt_ = token;
        this.user_ = payload as User;

        return true;
    }

    protected checkForCookieToken(): void {
        const savedToken = Cookies.get(COOKIE_NAME);

        if (savedToken) {
            this.verifyAndSetToken(savedToken);
        }
    }

    protected saveTokenToCookie(token: string): void {
        Cookies.set(COOKIE_NAME, token, { expires: 7 });
    }
}