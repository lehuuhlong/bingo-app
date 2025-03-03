export default function MemberOnline(props) {
  const { onlineUsers, nickname, usersBoard, user } = props;

  return (
    <>
      <h5 className="text-secondary text-center">👥 Members online: {onlineUsers.length}</h5>
      <ul className="list-unstyled text-center">
        {user.role === 'admin' &&
          onlineUsers.map((user, index) => (
            <li key={index} className={`alert ${usersBoard[user]?.point >= 20 ? 'alert-warning' : 'alert-info'} p-2 rounded shadow-sm`}>
              {user} - Point: {usersBoard[user]?.point}
            </li>
          ))}
        {user.role === 'user' &&
          onlineUsers.map((userOnline, index) => (
            <li
              key={index}
              className={`alert ${usersBoard[userOnline]?.nickname === nickname ? 'alert-warning' : 'alert-info'} p-2 rounded shadow-sm`}
              data-toggle="tooltip"
              data-placement="top"
              title={userOnline}
            >
              {usersBoard[userOnline]?.nickname}
            </li>
          ))}
      </ul>
    </>
  );
}
