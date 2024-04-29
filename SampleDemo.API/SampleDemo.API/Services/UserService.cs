using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SampleDemo.API.Entities;
using SampleDemo.API.Helpers;
using SampleDemo.API.Models;
using SampleDemo.API.Services.Interfaces;
using SampleDemo.Data;
using SampleDemo.Shared.Domain;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SampleDemo.API.Services
{
    public class UserService : IUserService
    {
        #region Declaration
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly AppSettings _appSettings;
        private readonly RoleManager<ApplicationRole> _roleManager;
        #endregion

        #region Constructor
        public UserService(IOptions<AppSettings> appSettings, ApplicationDbContext applicationDbContext, UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<ApplicationRole> roleMgr)
        {
            _appSettings = appSettings.Value;
            _applicationDbContext = applicationDbContext;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleMgr;
        }
        #endregion

        #region Method
        /// <summary>
        /// Authenticate User
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<Users> Authenticate(string username, string password)
        {
            var userDetail = await _userManager.FindByEmailAsync(username);

            // return null if user not found
            if (userDetail == null)
                return null;

            var singInResult = await _signInManager.CheckPasswordSignInAsync(userDetail, password, false);

            if (!singInResult.Succeeded) return null;

            var rolesForUser = await _userManager.GetRolesAsync(userDetail);

            await _signInManager.SignInAsync(userDetail, true);

            Users user = null;

            if (userDetail != null)
            {
                user = new Users();
                user.Id = userDetail.Id;
                user.FirstName = userDetail.FirstName;
                user.MiddleName = userDetail.MiddleName;
                user.LastName = userDetail.LastName;
                user.Username = userDetail.UserName;
                user.Email = userDetail.Email;
                user.Role = rolesForUser[0];
            }

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userDetail.Id),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user;
        }

        /// <summary>
        /// Get All User
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Users>> GetAll()
        {
            List<Users> _usersList = new List<Users>();
            var _users = await _applicationDbContext.Users.ToListAsync();
            if (_users != null)
            {
                foreach (var user in _users)
                {
                    var rolesForUser = await _userManager.GetRolesAsync(user);
                    Users users = new Users();
                    users.Id = user.Id;
                    users.FirstName = user.FirstName;
                    users.MiddleName = user.MiddleName;
                    users.LastName = user.LastName;
                    users.Username = user.UserName;
                    users.Email = user.Email;
                    users.Role = rolesForUser[0];
                    _usersList.Add(users);
                }
            }
            return _usersList;
        }

        /// <summary>
        /// Get User By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Users> GetById(string id)
        {
            var user = await _applicationDbContext.Users.FindAsync(id);
            if (user != null)
            {
                var rolesForUser = await _userManager.GetRolesAsync(user);
                Users users = new Users();
                users.Id = user.Id;
                users.FirstName = user.FirstName;
                users.MiddleName = user.MiddleName;
                users.LastName = user.LastName;
                users.Username = user.UserName;
                users.Email = user.Email;
                users.Role = rolesForUser[0];
                return users;
            }
            return null;
        }

        /// <summary>
        /// Create User
        /// </summary>
        /// <param name="addEditUserModel"></param>
        /// <returns></returns>
        public async Task<AddEditUserModel> CreateUser(AddEditUserModel addEditUserModel)
        {
            if (addEditUserModel != null && !_userManager.Users.Any(x => x.Email == addEditUserModel.Email))
            {
                User user = new User
                {
                    UserName = addEditUserModel.Email,
                    Email = addEditUserModel.Email,
                    EmailConfirmed = true,
                    FirstName = addEditUserModel.FirstName,
                    LastName = addEditUserModel.LastName,
                    MiddleName = addEditUserModel.MiddleName,
                };

                user.Id = Guid.NewGuid().ToString();
                var result = await _userManager.CreateAsync(user, addEditUserModel.Password);
                if (result.Succeeded)
                {
                    if (_roleManager.Roles.Any(x => x.Name.ToLower() == addEditUserModel.Role.ToLower()) && !string.IsNullOrWhiteSpace(addEditUserModel.Role) && addEditUserModel.Role.ToLower() != Role.Admin.ToLower())
                    {
                        await _userManager.AddToRoleAsync(user, addEditUserModel.Role);
                        await _applicationDbContext.SaveChangesAsync();
                    }
                    return addEditUserModel;
                }
            }
            return addEditUserModel;
        }

        /// <summary>
        /// Edit User
        /// </summary>
        /// <param name="addEditUserModel"></param>
        /// <returns></returns>
        public async Task<AddEditUserModel> EditUser(AddEditUserModel addEditUserModel)
        {
            if (addEditUserModel != null && _userManager.Users.Any(x => x.Id == addEditUserModel.Id))
            {
                var user = await _userManager.FindByIdAsync(addEditUserModel.Id);
                user.FirstName = addEditUserModel.FirstName;
                user.LastName = addEditUserModel.LastName;
                user.MiddleName = addEditUserModel.MiddleName;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    await _applicationDbContext.SaveChangesAsync();
                    return addEditUserModel;
                }
            }
            return addEditUserModel;
        }

        /// <summary>
        /// Delete User
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Users> DeleteUser(string id)
        {
            var user = await _applicationDbContext.Users.FindAsync(id);
            if (user != null)
            {
                Users users = await GetById(id);
                await _userManager.DeleteAsync(user);
                await _applicationDbContext.SaveChangesAsync();
                return users;
            }
            return null;
        }
        #endregion
    }
}