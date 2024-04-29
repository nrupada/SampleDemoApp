import React from 'react';
import { userService } from '@/_services';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

class EditUserPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            firstName: '',
            middleName: '',
            lastName: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { users } = this.state;
        var userid = localStorage.getItem('id');
        userService.getById(userid).then(result => {
            console.log(result); this.setState({
                id: result.id ,
                firstName: result.firstName,
                middleName: result.middleName,
                lastName: result.lastName,
            })
        });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        })
    }

    render() {

        return (
            <div>
                <Formik

                    initialValues={{
                        id: this.state.id,
                        firstName: this.state.firstName,
                        middleName: this.state.middleName,
                        lastName: this.state.lastName,
                    }}

                    onSubmit={({ firstName, middleName, lastName }, { setStatus, setSubmitting }) => {
                        if (this.state.firstName == "" || this.state.firstName == null) {
                            alert("First Name is required");
                            return;
                        }

                        if (this.state.middleName == "" || this.state.middleName == null) {
                            alert("Middle Name is required");
                            return;
                        }

                        if (this.state.lastName == "" || this.state.lastName == null) {
                            alert("Last Name is required");
                            return;
                        }

                        this.editUser = {
                            id: localStorage.getItem('id'),
                            firstName: this.state.firstName,
                            middleName: this.state.middleName,
                            lastName: this.state.lastName,
                        }

                        setStatus();
                        userService.editUser(this.editUser)
                            .then(
                                user => {
                                    alert("Update successfully");
                                    const { from } = this.props.location.state || { from: { pathname: "/listUser" } };
                                    this.props.history.push(from);
                                },
                                error => {
                                    alert("Error occured.");
                                    setSubmitting(false);
                                    setStatus(error);
                                }
                            );
                    }}

                    render={({ errors, status, touched, isSubmitting }) => (
                        <div class="col-md-12">
                            <div class="card">
                                <h4 class="card-header text-center">Edit User</h4>
                                <div class="card-body">
                                    <div class="col-md-12">
                                        <Form class="form">

                                            <div className="form-group">
                                                <label htmlFor="firstName">First Name:</label>
                                                <Field name="firstName" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="middleName">Middle Name:</label>
                                                <Field name="middleName" placeholder="Middle Name" value={this.state.middleName} onChange={this.handleChange} type="text" className={'form-control' + (errors.middleName && touched.middleName ? ' is-invalid' : '')} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="lastName">Last Name:</label>
                                                <Field name="lastName" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                            </div>

                                            <div className="form-group">
                                                <button type="submit" className="btn btn-success">Update</button>
                                            </div>

                                            {status &&
                                                <div className={'alert alert-danger'}>{status}</div>
                                            }
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    }
}

export { EditUserPage };