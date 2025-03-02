export default function MemberOnline(props) {
  const { onlineUsers, nickname, usersBoard } = props;

  return (
    <>
      <h5 className="text-secondary text-center">👥 Members online: {onlineUsers.length}</h5>
      <ul className="list-unstyled text-center">
        {onlineUsers.map((user, index) => (
          <li key={index} className={`alert ${usersBoard[user]?.nickname === nickname ? 'alert-warning' : 'alert-info'} p-2 rounded shadow-sm`}>
            {usersBoard[user]?.nickname}
            {usersBoard[user]?.nickname === nickname || nickname === 'Admin Bingo' ? ` - Point: ${usersBoard[user]?.point}` : ''}
          </li>
        ))}
      </ul>
    </>
  );
}
