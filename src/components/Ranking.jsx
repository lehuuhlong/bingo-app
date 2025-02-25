

const Ranking = (props) => {
  const { users } = props;

  return (
    <div className="">
      <h4 className="text-secondary text-center">Ranking🥇🥈🥉</h4>
      <ul className="list-unstyled text-center">
        {users
          .filter((userFiler) => userFiler.username !== 'admin')
          .map((user, index) => {
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
            } else if (index >= 9) {
              rankEmoji = `${((index + 1) / 10).toFixed()}️⃣${(index + 1) % 10}️⃣`;
            }

            return (
              <li key={user._id} className={`alert ${bgColor} p-2 rounded shadow-sm`}>
                {rankEmoji} <strong>{user.username}</strong> - Bingo: <strong>{user.bingoCount}</strong> - Point: <strong>{user.points}</strong>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Ranking;
