const Notification = ({ message, isError = false }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={isError ? 'error' : 'notification'}>
            {message}
        </div>
    )
}

export default Notification