function EditModeToggle({ editMode, setEditMode }) {
  return (
    <button
      className={`btn btn-${editMode ? 'secondary' : 'outline-secondary'} btn-sm`}
      onClick={() => setEditMode(!editMode)}
    >
      {editMode ? '편집 종료' : '편집'}
    </button>
  );
}
export default EditModeToggle; 