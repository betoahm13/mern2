import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { urlDin } from '../vGlobales'

export default class CreateNote extends Component {

    state = {
        users: [],
        userSelected: '',
        title: '',
        content: '',
        date: new Date(),
        editing: false,
        _id: ''
    }

    async componentDidMount() {
        const res = await axios.get(urlDin + '/api/users');
        this.setState({
            users: res.data.map(user => user.username),
            userSelected: res.data[0].username
        })
        if (this.props.match.params.id) {
            const res = await axios.get(urlDin + '/api/notes/' + this.props.match.params.id)
            console.log(res.data)
            this.setState({
                title: res.data.title,
                content: res.data.content,
                date: new Date(res.data.date),
                userSelected: res.data.author,
                editing: true,
                _id: this.props.match.params.id
            })
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();

        const newNote = {
            title: this.state.title,
            content: this.state.content,
            date: this.state.date,
            author: this.state.userSelected
        };

        if (this.state.editing) {
            await axios.put(urlDin + '/api/notes/' + this.state._id, newNote)
        }
        else {
            await axios.post(urlDin + '/api/notes', newNote);
        }

        window.location.href = '/';

    }

    onInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeDate = date => {
        this.setState({ date });
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card card-body">
                        <h4>Create Note</h4>

                        {/* SELECT USER*/}
                        <div className="mb-3">
                            <select
                                name="userSelected"
                                className="form-control"
                                onChange={this.onInputChange}
                                value={this.state.userSelected}
                            >
                                {
                                    this.state.users.map(user =>
                                        <option key={user} value={user}>
                                            {user}
                                        </option>)
                                }
                            </select>
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Title"
                                onChange={this.onInputChange}
                                value={this.state.title}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <textarea
                                name="content"
                                className="form-control"
                                placeholder="Content"
                                onChange={this.onInputChange}
                                value={this.state.content}
                                required
                            >
                            </textarea>
                        </div>

                        <div className="mb-3">
                            <DatePicker
                                className="form-control"
                                selected={this.state.date}
                                onChange={this.onChangeDate}
                            />
                        </div>

                        <form onSubmit={this.onSubmit}>
                            <button type="submit" className="btn btn-primary">
                                Save
                       </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
