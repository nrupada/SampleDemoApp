using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SampleDemo.Shared.Domain;
using System;

namespace SampleDemo.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<User>
    {
        public ApplicationDbContext(
          DbContextOptions options,
          IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Role
            modelBuilder.Entity<ApplicationRole>().HasData(new ApplicationRole { Id = "1e67e9cd-bf7e-4621-9b04-68ed8573ad2a", Name = "Admin", NormalizedName = "Admin".ToUpper() });
            modelBuilder.Entity<ApplicationRole>().HasData(new ApplicationRole { Id = "f8ee5677-2983-40ca-924d-fa131789457b", Name = "User", NormalizedName = "User".ToUpper() });
            modelBuilder.Entity<ApplicationRole>().HasData(new ApplicationRole { Id = "c9c80dbb-dea4-466c-8024-81c4d59d21ff", Name = "Manager", NormalizedName = "Manager".ToUpper() });
            #endregion

            #region User
            var hasher = new PasswordHasher<User>();

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = "c2b0541f-4819-4a10-9e62-63d53c2bf8a8", // primary key
                    UserName = "admin@gmail.com",
                    NormalizedUserName = "ADMIN@GMAIL.COM",
                    Email = "admin@gmail.com",
                    NormalizedEmail = "ADMIN@GMAIL.COM",
                    EmailConfirmed = true,
                    PhoneNumber = "255684811042",
                    PasswordHash = hasher.HashPassword(null, "1234"),
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    FirstName = "Admin",
                    LastName = "Admin",
                    MiddleName = "Admin"
                });

            modelBuilder.Entity<User>().HasData(
                 new User
                 {
                     Id = "aff709de-7468-451e-9839-b538cc7e9941", // primary key
                     UserName = "user@gmail.com",
                     NormalizedUserName = "User@GMAIL.COM",
                     Email = "user@gmail.com",
                     NormalizedEmail = "USER@GMAIL.COM",
                     EmailConfirmed = true,
                     PhoneNumber = "255684811043",
                     PasswordHash = hasher.HashPassword(null, "1234"),
                     SecurityStamp = Guid.NewGuid().ToString("D"),
                     FirstName = "User",
                     LastName = "User",
                     MiddleName = "User"
                 });
            #endregion

            #region User Role
            modelBuilder.Entity<ApplicationUserRole>().HasData(
                new ApplicationUserRole
                {
                    RoleId = "1e67e9cd-bf7e-4621-9b04-68ed8573ad2a",
                    UserId = "c2b0541f-4819-4a10-9e62-63d53c2bf8a8"
                });

            modelBuilder.Entity<ApplicationUserRole>().HasData(
               new ApplicationUserRole
               {
                   RoleId = "f8ee5677-2983-40ca-924d-fa131789457b",
                   UserId = "aff709de-7468-451e-9839-b538cc7e9941"
               });
            #endregion

            base.OnModelCreating(modelBuilder);
        }
    }
}