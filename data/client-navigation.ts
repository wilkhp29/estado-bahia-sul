import presentation from './client-presentation.json';

const destinations = ['/', '/#quem-somos', '/#historia', '/#cacau', '/#sonho', '/#por-que-criar', '/#o-que-vai-melhorar', '/#viabilidade', '/#base-legal', '/livro', '/noticias', '/#participe', '/contato'];
export const clientNavigation = presentation.sections.find(section => section.id === 'menu')!.lines.map((label, index) => ({
  // This suffix is an editorial instruction, not part of the requested title.
  label: label.replace(' ← título atualizado', ''),
  href: destinations[index],
}));
