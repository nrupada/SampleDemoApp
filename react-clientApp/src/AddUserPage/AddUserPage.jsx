import React from 'react';
import { userService } from '@/_services';
import { Formik, Field, Form, ErrorMessage, Dropdown} from 'formik';
import * as Yup from 'yup';

class AddUserPage extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            id: '',
            firstName: '',
            middleName: '',
            lastName:'',
            email: '',
            role: '',
            password: '',
        }
    }

    componentDidMount() {
        userService.getUserRole().then(UserRole => this.setState({ UserRole }));
    }

    render()
    {
        return (
            <div>
                <Formik

                    initialValues={{
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        role:''
                    }}

                    validationSchema = {Yup.object().shape({
                        firstName: Yup.string().required('First Name is required'),
                        middleName: Yup.string().required('Middle Name is required'),
                        lastName: Yup.string().required('Last Name is required'),
                        email: Yup.string().required('Email is required').email('Email is invalid'),
                        password: Yup.string().required('Password is required'),
                    })}

                    onSubmit={({ firstName, middleName, lastName, email, password, role }, { setStatus, setSubmitting }) => {

                        if (role == "") {
                            alert("User Role is required");
                            return;
                        }

                        this.createUser = {
                            firstName: firstName,
                            middleName: middleName,
                            lastName: lastName,
                            email: email,
                            role: "User",
                            password: password
                        }
                        setStatus();
                        userService.createUser(this.createUser)
                            .then(
                                user => {
                                    alert("Save successfully");
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
                                <h4 class="card-header text-center">Add User</h4>
                                <div class="card-body">
                                    <div class="col-md-12">

                                        <Form class="form">

                                            <div className="form-group">
                                                <label htmlFor="email">Email:</label>
                                                <Field name="email" placeholder="Email" type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="firstName">First Name:</label>
                                                <Field name="firstName" placeholder="First Name" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="middleName">Middle Name:</label>
                                                <Field name="middleName" placeholder="Middle Name" type="text" className={'form-control' + (errors.middleName && touched.middleName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="middleName" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="lastName">Last Name:</label>
                                                <Field name="lastName" placeholder="Last Name" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="role">User Role:</label>
                                                <div role="group" aria-labelledby="my-radio-group">
                                                    <label>
                                                        <Field type="radio" name="role" value="User"/>
                                                         &nbsp;User
                                                    </label>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <label>
                                                        <Field type="radio" name="role" value="Manager" />
                                                         &nbsp;Manager
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="password">Password:</label>
                                                <Field type="password" placeholder="Password" name="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="form-group">
                                                <button type="submit" className="btn btn-success">Save</button>
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
        );
    }
}

export { AddUserPage };





















































 //https://www.c-sharpcorner.com/article/crud-operations-using-web-api-and-reactjs/
 //https://www.c-sharpcorner.com/article/crud-operations-in-reactjs-with-axios-using-web-api-and-sql-server/