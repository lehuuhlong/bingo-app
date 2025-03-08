import { useEffect, useState, useRef } from 'react';
import ModalBingoName from '../modal/ModalBingoName';
import ModalReset from '../modal/ModalReset';
import MemberOnline from './MemberOnline';
import Ranking from './Ranking';
import { getUserById, getUsersRanking } from '../services/userService';
import Login from './Login';
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

export default function Bingo() {
  const [board, setBoard] = useState([]);
  const [usersBoard, setUsersBoard] = useState({});
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [bingoName, setBingoName] = useState([]);
  const [currentSpinningNumber, setCurrentSpinningNumber] = useState('🌟');
  const [usersRanking, setUsersRanking] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const buttonBingoRef = useRef(null);
  const buttonResetRef = useRef(null);

  useEffect(() => {
    fetchUsersRanking();
  }, []);

  const fetchUsersRanking = async () => {
    const data = await getUsersRanking();
    setUsersRanking(data);
  };

  const fetchUser = async () => {
    if (username) {
      const data = await getUserById(username);
      setUser(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isUsernameSet) {
      setLoading(true);
      socket.emit('setUsername', { username, nickname });
      setTimeout(() => {
        fetchUser();
      }, 2000);
    }
  }, [isUsernameSet]);

  useEffect(() => {
    socket.on('numberCalled', (newCalledNumbers) => {
      if (newCalledNumbers?.length === 0) return;
      const latestNumber = newCalledNumbers[newCalledNumbers.length - 1];

      let randomInterval = setInterval(() => {
        setCurrentSpinningNumber(Math.floor(Math.random() * 75) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(randomInterval);
        setCurrentSpinningNumber(latestNumber);
        setCalledNumbers(newCalledNumbers);
      }, 5000);
    });

    socket.on('updateUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('resetNumber', (usersBoard) => {
      // buttonResetRef.current.click();
      setUsersBoard(usersBoard);
      setCalledNumbers([]);
      setCurrentSpinningNumber('🌟');
      setBingoName([]);
      // setIsBingo(false);
      // setNearlyBingoName([]);
      // setNearlyBingoNumbers([]);
      window.location.reload();
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
      socket.off('numberCalled');
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
      if (usersBoard[userId]?.username === username) {
        setBoard(usersBoard[userId]?.board);
      }
    }
  }, [usersBoard]);

  const handleConfirm = () => {
    if (username.length < 4 || nickname.length === 0) {
      return;
    }

    if (username === 'Admin Bingo' && password !== process.env.REACT_APP_PASSWORD_ADMIN) {
      return;
    }

    setIsUsernameSet(true);
  };

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
    let totalAmount = onlineUsers.length * 20000;
    let totalFee = totalAmount * 0.05;
    let totalRollback = (onlineUsers.length - 1) * 2000;
    return totalAmount - totalRollback - totalFee;
  };

  if (!isUsernameSet) {
    return (
      <Login
        handleConfirm={handleConfirm}
        username={username}
        setUsername={setUsername}
        nickname={nickname}
        setNickname={setNickname}
        password={password}
        setPassword={setPassword}
      />
    );
  }

  return (
    <>
      {loading && <Spinners />}
      <div className="container-90 mt-1">
        <div className="row mb-2 text-center d-block">
          <img style={{ height: '150px' }} src="logo-bingo.jpg" alt="logo" />
        </div>

        <div className="row">
          <div className="col-lg-2">
            <div className="text-center">
              <img className="jackpot" src="jackpot.png" alt="jackpot" />
              <h5 className="text-center text-danger">{numberWithCommas(totalAmountJackpot())}</h5>
            </div>
            <div className="member-online-hide">
              <MemberOnline onlineUsers={onlineUsers} nickname={nickname} usersBoard={usersBoard} user={user} />
            </div>
          </div>
          <div className="col-lg-7">
            <Tabs defaultActiveKey="bingo" className="mb-3">
              <Tab eventKey="bingo" title="🔥Bingo">
                {bingoName && bingoName.length > 0 && (
                  <div className="text-center mb-4">
                    <h4 className="text-secondary">🎉 List users Bingo! 🎉</h4>
                    <div className="bg-gradient-light p-3 rounded shadow">
                      <div className="row">
                        {bingoName.map((name, index) => (
                          <div className={bingoName.length > 1 ? 'col-lg-6' : 'col'} key={index}>
                            <h6 className="text-warning mt-2">
                              Winner: {usersBoard[name]?.nickname} - {name} 🎉
                            </h6>
                            <div className="d-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', display: 'inline-grid' }}>
                              {usersBoard[name]?.board.flat().map((num, index) => (
                                <div
                                  key={index}
                                  className={`border p-3 rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm ${
                                    bingoName.length > 0
                                      ? usersBoard[name]?.bingoCells.includes(num)
                                        ? 'bg-success text-white'
                                        : calledNumbers.includes(num)
                                        ? 'bg-secondary text-white'
                                        : 'bg-light text-dark'
                                      : calledNumbers.includes(num)
                                      ? 'bg-success text-white'
                                      : 'bg-light text-dark'
                                  }`}
                                  style={{ width: '50px', height: '50px', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.3s' }}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mb-4 text-center">
                  <h4 className="text-secondary">🎲 Lottery number 🎲</h4>
                  <div className="d-flex flex-wrap gap-2 justify-content-center bg-light p-3 rounded shadow">
                    {calledNumbers.map(
                      (number, index) =>
                        number !== '🌟' && (
                          <div
                            key={index}
                            className={`mr-1 mb-1 rounded-circle d-flex align-items-center justify-content-center number-ball ${
                              bingoName.length > 0
                                ? numberBingCells(number)
                                  ? 'bg-success text-white'
                                  : 'bg-secondary text-white'
                                : 'bg-info text-white'
                            }`}
                            style={{
                              width: '50px',
                              height: '50px',
                              fontSize: '1.2rem',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                              animation: 'scaleIn 1s ease-in-out',
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                animation: 'spin 1s ease-in-out',
                              }}
                            >
                              {number}
                            </p>
                          </div>
                        )
                    )}
                    {currentSpinningNumber && bingoName.length === 0 && (
                      <div
                        className="number-ball"
                        style={{
                          width: '50px',
                          height: '50px',
                          fontSize: '1.2rem',
                          borderRadius: '50%',
                          backgroundColor: '#ffc107',
                          color: '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'spin 1s linear infinite',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {currentSpinningNumber}
                      </div>
                    )}
                  </div>
                </div>
                {user?.role === 'admin' ? (
                  <Admin onlineUsers={onlineUsers} bingoName={bingoName} usersBoard={usersBoard} calledNumbers={calledNumbers} />
                ) : (
                  <TicketBingo bingoName={bingoName} calledNumbers={calledNumbers} usersBoard={usersBoard} username={username} board={board} />
                )}
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
              <Tab eventKey="setting" title="⚙️Setting" disabled>
                Tab content for Profile
              </Tab>
              <Tab eventKey="contact" title="🎯Contact" disabled>
                Tab content for Contact
              </Tab>
            </Tabs>
          </div>

          <div className="col-lg-3">
            <CloseToBingo bingoName={bingoName} usersBoard={usersBoard} />
            <Chat username={username} nickname={nickname} user={user} />
            <Ranking isTopFive={true} usersRanking={usersRanking} />
            <div className="member-online-show">
              <MemberOnline onlineUsers={onlineUsers} nickname={nickname} usersBoard={usersBoard} user={user} />
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
    </>
  );
}
