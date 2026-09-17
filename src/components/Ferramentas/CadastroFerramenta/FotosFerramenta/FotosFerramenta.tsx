import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Icon } from '@iconify/react';
import { Plus, X } from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// Item de miniatura arrastável. Reaproveita exatamente o markup e as classes
// CSS que já existiam dentro do .map original — só passou a ser um
// subcomponente para poder usar o hook useSortable por item.
function MiniaturaOrdenavel({
  id,
  index,
  foto,
  onRemover,
}: {
  id: string;
  index: number;
  foto: string;
  onRemover: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : undefined,
    cursor: 'grab',
    touchAction: 'none', // evita conflito com o scroll da página ao arrastar no mobile
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.miniatura}
      {...attributes}
      {...listeners}
    >
      {index === 0 && <span className={styles.selo}>CAPA</span>}
      <img src={foto} alt={`Foto ${index + 1} da ferramenta`} draggable={false} />
      <button
        type="button"
        className={styles.botaoRemover}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemover(index);
        }}
        aria-label="Remover foto"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function FotosFerramenta({ fotos, onChange, error, shake }: FotosFerramentaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);

  const vagas = Math.max(0, MAXIMO_FOTOS - fotos.length);

  // distance: 8 evita que um simples clique (sem movimento) dispare um drag,
  // o que plocacao o clique no botão de remover e no tile "adicionar".
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);

    // Atualiza a ordem imediatamente via a mesma prop onChange já usada
    // pelo restante do componente — a primeira posição vira a nova capa.
    onChange(arrayMove(fotos, oldIndex, newIndex));
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
          <span className={styles.badge}>A 1ª foto será a capa — arraste para reordenar</span>
        </div>
      </div>

      {fotos.length > 0 && (
        <div className={styles.grade}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fotos.map((_, index) => index.toString())}
              strategy={rectSortingStrategy}
            >
              {fotos.map((foto, index) => (
                <MiniaturaOrdenavel
                  key={index}
                  id={index.toString()}
                  index={index}
                  foto={foto}
                  onRemover={removerFoto}
                />
              ))}
            </SortableContext>
          </DndContext>

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