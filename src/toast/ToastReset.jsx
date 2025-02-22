const ToastReset = (props) => {
  const { isDisplay, countResetBingo } = props;
  return (
    <div className="position-fixed bottom-0 right-0 p-3 toast-reset">
      <div
        id="liveToast"
        className={`toast fade ${isDisplay ? 'show' : 'hide'}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-delay="2000"
      >
        <div className="toast-header">
          <strong className="mr-auto">Bingo Game</strong>
          <small>just now</small>
          <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="toast-body">Your bingo ticket has been reset!({2 - countResetBingo} left)</div>
      </div>
    </div>
  );
};

export default ToastReset;
