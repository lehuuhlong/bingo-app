import { useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function MemberOnline(props) {
  const { onlineUsers, nickname, usersBoard, user } = props;
  const [onlineArranged, setOnlineArranged] = useState([]);

  useEffect(() => {
    const reArrangedList = [user?.username, ...onlineUsers.filter((name) => name !== user?.username)];
    setOnlineArranged(reArrangedList);
  }, [onlineUsers, user]);

  return (
    <>
      <h5 className="text-secondary text-center">👥 Members online: {onlineUsers.length}</h5>
      <ul className="list-unstyled text-center">
        {user?.role === 'admin' &&
          onlineUsers.map((user, index) => (
            <li key={index} className={`alert ${usersBoard[user]?.point >= 20 ? 'alert-warning' : 'alert-info'} p-2 rounded shadow-sm`}>
              {user} - Point: {usersBoard[user]?.point}
            </li>
          ))}
        {user?.role === 'user' &&
          onlineArranged &&
          onlineArranged.map((userOnline, index) => (
            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip>{userOnline}</Tooltip>}>
              <li
                key={index}
                className={`alert ${usersBoard[userOnline]?.nickname === nickname ? 'alert-warning' : 'alert-info'} p-2 rounded shadow-sm`}
              >
                {usersBoard[userOnline]?.nickname}
              </li>
            </OverlayTrigger>
          ))}
      </ul>
    </>
  );
}
