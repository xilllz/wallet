import '../css/LeaveWallet.css'

interface LeaveWalletProps {
    onCancel: () => void;
    onExit: () => void;
}

export function LeaveWallet({ onCancel, onExit }: LeaveWalletProps) {
    return (
        <div className="leave-window">
            <h2 className="leave-window-text">Вы уверены что хотите выйти?</h2>
            <div className="leave__button-block">
                <button className="exit" onClick={onExit}>Выйти</button>
                <button className="cancel" onClick={onCancel}>Отмена</button>
            </div>
        </div>
    );
}