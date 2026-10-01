export const photos = {
 coast:{id:'photo-1561733631-f2481dfd7425',alt:'Coqueiros junto à praia em Itacaré, Bahia',author:'Mr. Söbau',source:'https://unsplash.com/photos/b325A2xzj-8',caption:'Itacaré · Bahia'},
 cacao:{id:'photo-1781453642070-7e21b8246e9d',alt:'Frutos amarelos de cacau em uma árvore',author:'Kawê Rodrigues',source:'https://unsplash.com/photos/5gW5M5tzXQA',caption:'Cacau · imagem temática, Pará'},
 ship:{id:'photo-1552207802-77bcb0d13122',alt:'Embarcação no oceano',author:'Nate Cheney',source:'https://unsplash.com/photos/iPrYNHEBieE',caption:'Logística · imagem temática'},
 education:{id:'photo-1758270704787-615782711641',alt:'Pessoas conversando e estudando em sala de aula',author:'Vitaly Gariev',source:'https://unsplash.com/photos/wAgfqXpYqug',caption:'Educação · imagem temática'},
};
export const photoUrl=(id:string,width=1000)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
