using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SampleDemo.API.Entities;
using SampleDemo.API.Models;
using SampleDemo.API.Services.Interfaces;
using SampleDemo.Shared.Domain;
using System.Threading.Tasks;

namespace SampleDemo.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        #region Declaration
        private IUserService _userService;
        private readonly UserManager<User> _userManager;
        #endregion

        #region Constructor 
        public UsersController(IUserService userService, UserManager<User> userManager)
        {
            _userService = userService;
            _userManager = userManager;
        }
        #endregion

        #region Method
        /// <summary>
        /// Authenticate
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateModel model)
        {
            var user = await _userService.Authenticate(model.Username, model.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect." });

            return Ok(user);
        }

        /// <summary>
        /// Get All User
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }

        /// <summary>
        /// Get User By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            // only allow admins to access other user records
            var currentUserId = User.Identity.Name;
            if (id != currentUserId && !User.IsInRole(Role.Admin))
                return Forbid();

            var user = await _userService.GetById(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        /// <summary>
        /// Create User
        /// </summary>
        /// <param name="addEditUserModel"></param>
        /// <returns></returns>
        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddEditUserModel addEditUserModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please enter Valid Detail.");
            }
            return Ok(await _userService.CreateUser(addEditUserModel));
        }

        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="id"></param>
        /// <param name="addEditUserModel"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] AddEditUserModel addEditUserModel)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Please enter Valid Detail.");
            }
            return Ok(await _userService.EditUser(addEditUserModel));
        }

        /// <summary>
        /// Delete
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Please enter Valid Detail.");
            }

            return Ok(await _userService.DeleteUser(id));
        }
        #endregion
    }
}