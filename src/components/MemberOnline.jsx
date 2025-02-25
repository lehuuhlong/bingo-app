export default function MemberOnline(props) {
  const { onlineUsers, username } = props;

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <>
      <h5 className="text-secondary text-center">👥 Members online: {onlineUsers.length}</h5>
      <h6 className="text-center text-danger">{numberWithCommas(onlineUsers.length * 20000)}đ</h6>
      <ul className="list-unstyled text-center">
        {onlineUsers.map((user, index) => (
          <li key={index} className={`alert ${user === username ? 'alert-warning' : 'alert-info'} p-2 rounded shadow-sm`}>
            {user}
          </li>
        ))}
      </ul>
    </>
  );
}
