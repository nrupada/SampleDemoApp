using Microsoft.AspNetCore.Identity;

namespace SampleDemo.Shared.Domain
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; } 
        public string MiddleName { get; set; } 
        public string LastName { get; set; }
        public string Address1 { get; set; } 
        public string City { get; set; } 
        public string StateCode { get; set; } 
        public string CountryCode { get; set; }
        public string Zip { get; set; } 
        public string Phone { get; set; } 
        public string Gender { get; set; }
    }
}