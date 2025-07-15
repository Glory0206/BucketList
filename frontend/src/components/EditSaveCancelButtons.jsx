function EditSaveCancelButtons({ onSave, onCancel }) {
  return (
    <>
      <button className="btn btn-success btn-sm me-1" onClick={onSave}>저장</button>
      <button className="btn btn-secondary btn-sm" onClick={onCancel}>취소</button>
    </>
  );
}
export default EditSaveCancelButtons;