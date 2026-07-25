import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Icon } from '@iconify/react';
import { Plus, X } from 'lucide-react';
import styles from './FotosFerramenta.module.css';

const MAXIMO_FOTOS = 8;

interface FotosFerramentaProps {
  fotos: string[];
  onChange: (fotos: string[]) => void;
  error?: string;
  shake?: boolean;
}

// Converte cada arquivo de imagem selecionado em uma data URL, para ter uma
// pré-visualização real sem precisar de upload pra um servidor (mock local).
function lerArquivosComoDataUrl(arquivos: FileList): Promise<string[]> {
  const leituras = Array.from(arquivos)
    .filter((arquivo) => arquivo.type.startsWith('image/'))
    .map(
      (arquivo) =>
        new Promise<string>((resolve, reject) => {
          const leitor = new FileReader();
          leitor.onload = () => resolve(leitor.result as string);
          leitor.onerror = reject;
          leitor.readAsDataURL(arquivo);
        }),
    );

  return Promise.all(leituras);
}

export default function FotosFerramenta({ fotos, onChange, error, shake }: FotosFerramentaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);

  const vagas = Math.max(0, MAXIMO_FOTOS - fotos.length);

  const adicionarArquivos = async (arquivos: FileList | null) => {
    if (!arquivos || arquivos.length === 0 || vagas === 0) return;

    const novasFotos = await lerArquivosComoDataUrl(arquivos);
    onChange([...fotos, ...novasFotos].slice(0, MAXIMO_FOTOS));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastando(false);
    adicionarArquivos(e.dataTransfer.files);
  };

  const removerFoto = (index: number) => {
    onChange(fotos.filter((_, i) => i !== index));
  };

  return (
    <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
      <div
        className={`${styles.dropzone} ${arrastando ? styles.dropzoneAtiva : ''} ${error ? styles.dropzoneErro : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={handleDrop}
        onClick={() => vagas > 0 && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            adicionarArquivos(e.target.files);
            e.target.value = '';
          }}
        />

        <div className={styles.iconeUpload}>
          <Icon icon="mdi:tray-arrow-up" width={26} height={26} />
        </div>

        <p className={styles.textoPrincipal}>Arraste e solte suas fotos aqui</p>
        <p className={styles.textoSecundario}>
          ou <span className={styles.link}>clique para selecionar</span>
        </p>

        <div className={styles.badges}>
          <span className={styles.badge}>Até 8 fotos — {fotos.length}/8 adicionadas</span>
          <span className={styles.badge}>Mínimo 1 foto obrigatória</span>
          <span className={styles.badge}>A 1ª foto será a capa</span>
        </div>
      </div>

      {fotos.length > 0 && (
        <div className={styles.grade}>
          {fotos.map((foto, index) => (
            <div key={index} className={styles.miniatura}>
              {index === 0 && <span className={styles.selo}>CAPA</span>}
              <img src={foto} alt={`Foto ${index + 1} da ferramenta`} />
              <button
                type="button"
                className={styles.botaoRemover}
                onClick={(e) => {
                  e.stopPropagation();
                  removerFoto(index);
                }}
                aria-label="Remover foto"
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {vagas > 0 && (
            <button
              type="button"
              className={styles.tileAdicionar}
              onClick={() => inputRef.current?.click()}
              aria-label="Adicionar foto"
            >
              <Plus size={22} />
            </button>
          )}
        </div>
      )}

      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
}
