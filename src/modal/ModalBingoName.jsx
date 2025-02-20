export default function ModalBingoName(props) {
  const { bingoName } = props;
  return (
    <div className="modal fade" id="bingoModal" tabIndex="-1" aria-labelledby="bingoModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="bingoModalLabel">
              Congratulation users Bingo 🎉
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-left">
            <ul>
              {bingoName.map((name, index) => (
                <li key={index} className="mb-1">
                  {name + ' 🎉'}
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
