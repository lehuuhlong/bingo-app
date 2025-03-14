const Ranking = (props) => {
  const { usersRanking, isTopFive } = props;

  const renderRankingList = (users) => {
    return users.map((user, index) => {
      let bgColor = 'alert-warning';
      let rankEmoji = `${index + 1}️⃣`;

      if (index === 0) {
        bgColor = 'alert-primary';
        rankEmoji = '🥇';
      }
      if (index === 1) {
        bgColor = 'alert-info';
        rankEmoji = '🥈';
      }
      if (index === 2) {
        bgColor = 'alert-success';
        rankEmoji = '🥉';
      } else if (index > 8) {
        rankEmoji = `${index + 1}. `;
      }

      return (
        <li key={user._id} className={`alert ${bgColor} p-2 rounded shadow-sm`}>
          {rankEmoji} <strong>{user.username}</strong> - Bingo: <strong>{user.bingoCount}</strong> - Point: <strong>{user.pointBingo}</strong>
        </li>
      );
    });
  };

  return (
    <>
      {isTopFive ? (
        <div>
          <h4 className="text-secondary text-center">🥇Top 5🥈</h4>
          <ul className="list-unstyled text-center">{renderRankingList(usersRanking.slice(0, 5))}</ul>
        </div>
      ) : (
        <div className="ranking">
          <h4 className="text-secondary text-center">🥇🥈🥉</h4>
          <ul className="list-unstyled text-center">{renderRankingList(usersRanking)}</ul>
        </div>
      )}
    </>
  );
};

export default Ranking;
