import React from 'react';
import { userService } from '@/_services';

class ListUserPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null,
            response: {}
        };
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

    deleteUser(userId) {
        const { users } = this.state;
        userService.deleteUser(userId).then(result => this.setState({
            response: result,
            users: users.filter(user => user.id !== userId) }));
    }

    editUser(userId) {
        localStorage.removeItem('id');
        localStorage.setItem('id', userId.toString());
        this.props.history.push('/editUser');
    }

    navigateToAddUser() {
        this.props.history.push('/addUser');
    }

    render()
    {
        const { users } = this.state;
        return (
            <div>
                <div class="card mt-4">
                    <h4 class="card-header">User Details </h4>
                    <div class="card-body">
                        <div>
                            <button class="btn btn-success" onClick={ () => this.navigateToAddUser()}>Add User</button>
                        </div>
                        <br />
                        <div class="spinner-border spinner-border-sm"></div>
                        <div class="col-md-12">
                            <div class="table-responsive table-container">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>First Name</th>
                                            <th>Middle Name</th>
                                            <th>Last Name</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users &&
                                            users.map(user =>
                                                <tr key={user.id}>
                                                    <td class="hidden">{user.email}</td>
                                                    <td>{user.firstName}</td>
                                                    <td>{user.middleName}</td>
                                                    <td>{user.lastName}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <button onClick={() => this.deleteUser(user.id)} class="btn btn-danger"> Delete</button>&nbsp;&nbsp;
                                                        <button onClick={() => this.editUser(user.id)} class="btn btn-success"> Edit</button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { ListUserPage };