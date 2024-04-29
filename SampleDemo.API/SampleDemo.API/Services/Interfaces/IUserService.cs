using SampleDemo.API.Entities;
using SampleDemo.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SampleDemo.API.Services.Interfaces
{
    public interface IUserService
    {
        #region Method
        Task<Users> Authenticate(string username, string password);
        Task<IEnumerable<Users>> GetAll();
        Task<Users> GetById(string id);
        Task<AddEditUserModel> CreateUser(AddEditUserModel addEditUserModel);
        Task<AddEditUserModel> EditUser(AddEditUserModel addEditUserModel);
        Task<Users> DeleteUser(string id);
        #endregion
    }
}