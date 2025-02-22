const MemberOnline = (props) => {
  const { onlineUsers, username } = props;
  return (
    <>
      <h5 className="text-secondary text-center">👥 Members online: {onlineUsers.length}</h5>
      <ul className="list-unstyled text-center">
        {onlineUsers.map((user, index) => (
          <li key={index} className={`alert ${user === username ? 'alert-warning' : 'alert-info'} p-2 rounded shadow-sm`}>
            {user}
          </li>
        ))}
      </ul>
    </>
  );
};

export default MemberOnline;
