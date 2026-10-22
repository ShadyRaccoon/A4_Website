# A4 Website

Website and admin panel for **A4**, a student organization. The public site shows the organization's articles, departments and contact info; the admin panel (`/panou`) is used by members to manage content, members, departments and accounts.

> **Status:** not currently deployed.

## Tech stack

- **Backend:** ASP.NET Core 10 (C#), Entity Framework Core, ASP.NET Identity
- **Database:** MySQL (Pomelo provider), EF Core migrations
- **Frontend:** React 19, Vite, React Router 7
- **Storage:** Azure Blob Storage (post images)
- **Email:** MailKit over SMTP (STARTTLS)
- **CI:** GitHub Actions (restore, build, test on push and pull request)

## Features

**Public site**
- Home page with a featured post and article list, articles page, single post view
- Departments, About and Contact pages

**Admin panel**
- Posts: create, edit, preview, hide/unhide, with optional image upload
- Members: create, edit, mark as left
- Departments: view members with join and leave dates, add and remove members
- Accounts: create accounts with a role, activate and deactivate them
- Account requests: members request access, admins accept or deny
- Devices: list and deactivate registered devices
- Sidebar menu adapts to the user's role (Member, Bureau, Admin)

## Security

- **Authentication:** ASP.NET Identity with a password policy, JWT tokens (HMAC-SHA256) carrying the user's role
- **Role-based authorization** on every admin endpoint
- **Device binding:** besides logging in, each browser must be registered through a one-time link sent by email. A middleware blocks API calls from unregistered devices, so a leaked password alone isn't enough to access the panel.
- Deactivated accounts can't log in
- API returns 401/403 instead of redirects

## Data model highlights

- **Membership history:** members are linked to departments through a join table with join and leave dates. Removing a member sets a leave date instead of deleting the row, so history is kept.
- **Images:** uploads get a unique name and are stored in a private Blob Storage container. Replacing or deleting a post's image also deletes the blob, so no orphaned files are left behind.

## Running locally

**Backend**
```bash
cd a4_backend
# set the MySQL connection string, JWT key, SMTP and Blob Storage settings
# (user secrets or appsettings.Development.json)
dotnet ef database update
dotnet run
```
For image uploads without an Azure account, the [Azurite](https://github.com/Azure/Azurite) emulator works with `UseDevelopmentStorage=true`.

**Frontend**
```bash
cd a4_frontend
npm install
npm run dev
```

## Known issues / next steps

- Enforce post ownership (currently any member can edit any post)
- Seed all roles used by the code and map officer roles to permissions
- Restrict the image download endpoint to the app's own storage container
- Revoke active sessions when an account is deactivated
- Replace placeholder tests with real controller and service tests
- Move hard-coded localhost URLs into configuration
