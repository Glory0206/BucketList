function EditActionButtons({ onEdit, onDelete }) {
    return (
      <>
        <button className="btn btn-outline-primary btn-sm me-2" onClick={onEdit}>수정</button>
        <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>삭제</button>
      </>
    );
  }
  export default EditActionButtons;