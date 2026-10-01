import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProfessorPortrait from './ProfessorPortrait';
import { candidate } from '../data/candidate';

export default function ProjectIntroduction() {
  return <div className="project-journey">
    <section className="story-intro" aria-labelledby="story-intro-title">
      <div><h2 id="story-intro-title">O futuro começa<br/>com uma conversa.</h2><Link className="story-text-link" href="/entenda">Entenda em 2 minutos <ArrowRight size={18} aria-hidden="true"/></Link></div>
      <div><p>Bahia do Sul é uma proposta de criação de um novo Estado a partir de parte do território baiano. A ideia coloca em debate desenvolvimento regional, representação e serviços mais próximos das pessoas.</p><p>Este portal apresenta o projeto e promove a participação política de Professor Guilherme. Conheça os argumentos, explore o território e forme sua opinião.</p></div>
    </section>
    <section className="story-candidate" aria-labelledby="story-candidate-title">
      <figure><ProfessorPortrait/><figcaption><a href={candidate.source.url} target="_blank" rel="noreferrer">Foto: Opera Mundi</a></figcaption></figure>
      <div><h2 id="story-candidate-title">Conheça<br/>Professor Guilherme.</h2><p>Conheça a relação de Guilherme com o Bahia do Sul, os temas que o projeto coloca em debate e seu canal público para acompanhar a conversa.</p><Link className="story-button story-button-light" href={candidate.path}>Conhecer Guilherme e a proposta <ArrowRight size={18} aria-hidden="true"/></Link><p className="story-candidate-caption">Candidato a deputado federal · Bahia · 2026.</p></div>
    </section>
  </div>;
}
