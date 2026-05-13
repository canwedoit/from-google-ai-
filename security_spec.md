# Firestore Security Specification

## Data Invariants
1. **Sites**: Publicly readable. Modifiable only by users with the 'admin' role in their user profile or specific hardcoded admin email.
2. **User Profiles**: Each user can only read and write their own profile (`/users/{userId}`). `role` field cannot be modified by the user (must be set by admin or system).
3. **Bookings**: Users can create bookings where `userId` matches their `auth.uid`. They can only read their own bookings. Bookings are immutable after creation to prevent fraud.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing (Users)**: User A tries to read User B's profile.
2. **Privilege Escalation**: User A tries to update their own `role` to 'admin'.
3. **Identity Spoofing (Bookings)**: User A tries to create a booking for User B (`userId: 'userB'`).
4. **Unauthorized Access (Sites)**: Non-admin tries to create/update/delete a site.
5. **PII Leak**: User A tries to list all user profiles (which contains emails).
6. **Orphaned Write**: User A tries to create a booking for a non-existent `siteId`.
7. **Shadow Field injection**: User A adds `isAdmin: true` to a site document.
8. **Temporal Integrity Breach**: User A tries to set `createdAt` for a booking to a date in the past instead of `request.time`.
9. **Outcome Tampering**: User A tries to update the `price` of an existing booking.
10. **ID Poisoning**: User A tries to create a site with a 2MB string as its ID.
11. **Relational Bypass**: User A tries to read a booking belonging to User B.
12. **Blanket Read Request**: User A tries to fetch `/bookings` without a `where` clause filtering by their `userId`.

## Test Scenarios
- [ ] List all sites (Anonymous) -> ALLOW
- [ ] Create site (Non-admin) -> DENY
- [ ] Create site (Admin) -> ALLOW
- [ ] Read other user profile -> DENY
- [ ] Set own role to admin -> DENY
- [ ] Create booking for self -> ALLOW
- [ ] Create booking for other -> DENY
- [ ] Update site status (Admin) -> ALLOW
- [ ] Delete booking (User) -> DENY
