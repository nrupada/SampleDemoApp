using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SampleDemo.API.Entities;
using SampleDemo.API.Models;
using SampleDemo.Shared.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SampleDemo.API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class DropdownController : ControllerBase
    {
        #region Declaration
        private readonly RoleManager<ApplicationRole> _roleManager;
        #endregion

        #region Constructor 
        public DropdownController(RoleManager<ApplicationRole> roleMgr)
        {
            _roleManager = roleMgr;
        }
        #endregion

        /// <summary>
        /// Get User Role Select List
        /// </summary>
        /// <returns></returns>
        [Route("GetRoleSelectList")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SelectItemList>>> GetRoleSelectList()
        {
            return await _roleManager.Roles
             .Select(c => new SelectItemList
             {
                 Value = c.Id,
                 Text = c.Name
             }).Where(x=>x.Text.ToLower() != Role.Admin.ToLower()).ToListAsync();
        }
    }
}