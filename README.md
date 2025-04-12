# 🛡️ NestJS Auth Starter

En robust og fleksibel starter for autentisering og autorisasjon i [NestJS](https://nestjs.com/), drevet av [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) og moderne tilgangsstyring.

> ⚠️ Ikke bare en auth-starter. Dette er en **plattform for strukturert kontroll** – bygget med produksjon i tankene og fleksibilitet som mål.

---

## 🚀 Teknologi

- **NestJS** – Moderne, modulært backend-rammeverk
- **Prisma** – Type-safe ORM med autogenerering
- **PostgreSQL** – Solid og åpen database
- **JWT** – Access + Refresh token-håndtering
- **BCrypt** – Trygg hashing av passord
- **ESLint + Prettier** – Kodekvalitet og stil
- **REST Client (IntelliJ)** – API-testing rett i editoren
- **PermissionCacheService (with TTL)** – Lynrask tilgangssjekk uten databasehit

---

## 🧠 Arkitektur

Dette prosjektet støtter:

✅ Brukere med **flere roller**  
✅ Roller med **egendefinerte permissions**  
✅ `TLA`-rollen – en **superadmin** som overstyrer alt  
✅ Ruter beskyttet med `@Permissions()` + `PermissionsGuard`  
✅ Eierskapssjekk og grunnlag for `@Ownership()` decorators  
✅ Automatisk **in-memory cache** av permissions (med utløp)

---

## 📦 Eksempler på permissions

```ts
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Permissions('USER_CREATE', 'USER_DELETE')
@Post('user')
createUser() {
  return 'Oppretter bruker';
}
