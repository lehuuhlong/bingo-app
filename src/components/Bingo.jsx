import { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ModalBingoName from '../modal/ModalBingoName';
import ModalReset from '../modal/ModalReset';
import MemberOnline from './MemberOnline';
import Ranking from './Ranking';
import { getUsersRanking } from '../services/userService';
import Admin from './Admin';
import TicketBingo from './TicketBingo';
import TransactionTable from './TransactionTable';
import Spinners from './Spinners';
import Chat from './Chat';
import { Tab, Tabs } from 'react-bootstrap';
import socket from '../services/socket';
import BingoStatistics from './BingoStatistics';
import UserTable from './UserTable';
import CloseToBingo from './CloseToBingo';
import { Link, useNavigate } from 'react-router-dom';
import Setting from './Setting';
import View from './View';
import LotteryNumber from './LotteryNumber';
import Board from './Board';

export default function Bingo() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [board, setBoard] = useState([]);
  const [isCallSocket, setIsCallSocket] = useState(false);
  const [usersBoard, setUsersBoard] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [bingoName, setBingoName] = useState([]);
  const [usersRanking, setUsersRanking] = useState([]);

  const buttonBingoRef = useRef(null);
  const buttonResetRef = useRef(null);

  useEffect(() => {
    if (user.isLogin && !isCallSocket) {
      socket.emit('setUsername', { username: user.username, nickname: user.nickname, role: user.role });
      setIsCallSocket(true);
    }
  }, [user, isCallSocket]);

  useEffect(() => {
    fetchUsersRanking();
  }, []);

  const fetchUsersRanking = async () => {
    const data = await getUsersRanking();
    setUsersRanking(data);
  };

  useEffect(() => {
    socket.on('updateUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('resetNumber', (usersBoard) => {
      // buttonResetRef.current.click();
      setUsersBoard(usersBoard);
      // setCalledNumbers([]);
      // setCurrentSpinningNumber('🌟');
      setBingoName([]);
      // setIsBingo(false);
      // setNearlyBingoName([]);
      // setNearlyBingoNumbers([]);
      logout();
      navigate('/login');
    });

    socket.on('isBingo', (username) => {
      buttonBingoRef.current.click();
      setBingoName(username);
    });

    socket.on('userBoard', (userBoard) => {
      setBoard(userBoard);
    });

    socket.on('usersBoard', (usersBoard) => {
      setUsersBoard(usersBoard);
    });

    socket.on('bingoNames', (bingoNames) => {
      setBingoName(bingoNames);
    });

    return () => {
      socket.off('updateUsers');
      socket.off('isBingo');
      socket.off('bingoNames');
      socket.off('userBoard');
      socket.off('resetNumber');
      socket.off('nearlyBingo');
    };
  }, []);

  useEffect(() => {
    for (let userId in usersBoard) {
      if (usersBoard[userId]?.username === user?.username) {
        setBoard(usersBoard[userId]?.board);
      }
    }
  }, [usersBoard]);

  const numberBingCells = (num) => {
    let isNumber = false;
    for (let name of bingoName) {
      isNumber = usersBoard[name]?.bingoCells.includes(num);
      if (isNumber) break;
    }

    return isNumber;
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const totalAmountJackpot = () => {
    let totalAmount = onlineUsers.length * 20;
    let totalFee = totalAmount * 0.05;
    let totalRollback = (onlineUsers.length - 1) * 2;
    return totalAmount - totalRollback - totalFee;
  };

  const renderTicket = (role) => {
    switch (role) {
      case 'admin':
        return <Admin onlineUsers={onlineUsers} bingoName={bingoName} usersBoard={usersBoard} />;
      case 'user':
        return <TicketBingo bingoName={bingoName} usersBoard={usersBoard} username={user?.username} board={board} />;
      case 'moderator':
        return <View bingoName={bingoName} usersBoard={usersBoard} />;
      case 'guest':
        return null;
      default:
        return <Spinners />;
    }
  };

  return (
    <div className="container-90 mt-1">
      <div className="row mb-2 text-center d-block">
        <img style={{ height: '150px' }} src="logo-bingo.jpg" alt="logo" />
      </div>

      <div className="row">
        <div className="col-lg-2">
          <div className="text-center">
            <img className="jackpot" src="jackpot.png" alt="jackpot" />
            <h5 className="text-center text-danger">{numberWithCommas(totalAmountJackpot())} Point</h5>
          </div>
          <div className="member-online-hide">
            <MemberOnline onlineUsers={onlineUsers} usersBoard={usersBoard} user={user} />
          </div>
        </div>
        <div className="col-lg-7">
          <Link
            to="/login"
            className="text-info font-weight-bold"
            style={{ position: 'absolute', top: 10, right: 20, textDecoration: 'none' }}
            onClick={logout}
          >
            🚀Logout
          </Link>
          <Tabs defaultActiveKey="bingo" className="mb-3">
            <Tab eventKey="bingo" title="🔥Bingo">
              {bingoName && bingoName.length > 0 && (
                <div className="text-center mb-4">
                  <h4 className="text-secondary">🎉 List users Bingo! 🎉</h4>
                  <div className="bg-gradient-light p-3 rounded shadow">
                    <div className="row">
                      {bingoName.map((name, index) => (
                        <div className={`${bingoName.length > 1 ? 'col-lg-6' : 'col'} mb-3`} key={index}>
                          <h6 className="text-info mt-2">
                            Winner: {usersBoard[name]?.nickname} - {name} - Point: 🎉
                          </h6>
                          <Board
                            board={usersBoard[name]?.board}
                            bingoName={bingoName}
                            bingoCells={usersBoard[name]?.bingoCells}
                            boardStyle={{
                              circle: '50px',
                              numSize: '1.2rem',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <LotteryNumber numberBingCells={numberBingCells} bingoName={bingoName} />
              {renderTicket(user?.role)}
            </Tab>
            <Tab eventKey="ranking" title="🥇Ranking">
              <Ranking isTopFive={false} usersRanking={usersRanking} />
            </Tab>
            <Tab eventKey="statistics" title="📊Statistics">
              <BingoStatistics />
            </Tab>
            {user?.role === 'admin' && (
              <Tab eventKey="users" title="📋User">
                <UserTable />
              </Tab>
            )}
            <Tab eventKey="history" title="📋History">
              {user?.role && <TransactionTable user={user} />}
            </Tab>
            <Tab eventKey="setting" title="⚙️Setting">
              <Setting />
            </Tab>
            <Tab eventKey="contact" title="🎯Contact" disabled>
              Tab content for Contact
            </Tab>
          </Tabs>
        </div>

        <div className="col-lg-3">
          <CloseToBingo bingoName={bingoName} usersBoard={usersBoard} />
          <Chat user={user} />
          <Ranking isTopFive={true} usersRanking={usersRanking} />
          <div className="member-online-show">
            <MemberOnline onlineUsers={onlineUsers} usersBoard={usersBoard} user={user} />
          </div>
        </div>
      </div>

      <ModalBingoName bingoName={bingoName} usersBoard={usersBoard} />
      <ModalReset />

      <button
        ref={buttonBingoRef}
        style={{ display: 'none' }}
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#bingoModal"
      ></button>

      <button
        ref={buttonResetRef}
        style={{ display: 'none' }}
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#resetModal"
      ></button>
    </div>
  );
}
