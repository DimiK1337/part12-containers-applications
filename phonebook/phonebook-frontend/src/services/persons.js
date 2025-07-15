import axios from 'axios'
const baseurl = `/api/persons`

const getAllPersons = () => {
    const request = axios.get(baseurl)
    return request.then(res => res.data)
}

const createPerson = (newObject) => {
    const request = axios.post(baseurl, newObject)
    return request.then(res => res.data)
}

const updatePerson = (id, newObject) => {
    const request = axios.put(`${baseurl}/${id}`, newObject)
    return request.then(res => res.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseurl}/${id}`)
    return request.then(res => res.data)
}

export default { getAllPersons, createPerson, updatePerson, deletePerson }