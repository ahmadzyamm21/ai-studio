import BackgroundLibrary from '@/components/background-library/BackgroundLibrary';

export default function Page() {
  return (
    <>
      <div className="header">
        <div>
          <h1>Assets</h1>
          <div className="muted">Kelola background lokal untuk kebutuhan prompt dan generasi AI.</div>
        </div>
      </div>
      <div className="card">
        <h2>Background Library</h2>
        <p className="muted">Unggah background Anda sendiri dan pilih satu background aktif untuk tahap berikutnya.</p>
      </div>
      <BackgroundLibrary />
    </>
  );
}

