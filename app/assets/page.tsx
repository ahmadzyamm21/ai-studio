import BackgroundLibrary from '@/components/background-library/BackgroundLibrary';

export default function Page() {
  return (
    <>
      <div className="header">
        <div>
          <h1>Background Library</h1>
          <div className="muted">Kelola background referensi untuk Prompt Factory.</div>
        </div>
      </div>

      <BackgroundLibrary />
    </>
  );
}
