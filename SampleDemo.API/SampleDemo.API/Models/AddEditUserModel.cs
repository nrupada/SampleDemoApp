using System.ComponentModel.DataAnnotations;

namespace SampleDemo.API.Models
{
    public class AddEditUserModel
    {
        public string Id { get; set; }

        public string Email { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string MiddleName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string Password { get; set; }

        public string Role { get; set; }
    }
}