import nodemailer from 'nodemailer';
export async function sendVerification(email:string,token:string,name:string,municipality:string){
 const base=process.env.SITE_URL!;
 const link=new URL('/participar/confirmar',base);link.searchParams.set('token',token);
 const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_PORT==='465',requireTLS:process.env.SMTP_PORT!=='465',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:10000,socketTimeout:15000});
 await transport.sendMail({from:process.env.SMTP_FROM,to:email,subject:'Confirme sua participação — Bahia do Sul',text:`Foi solicitada uma participação no abaixo-assinado Bahia do Sul.\n\nNome informado: ${name}\nMunicípio: ${municipality}\n\nConfira os dados e, somente se foi você, abra o link e confirme sua escolha: ${link}\n\nO link vence em 24 horas. Se não foi você ou houver dados incorretos, não confirme. Nenhum apoio será contado sem confirmação. Trata-se de uma manifestação simbólica, não de voto ou plebiscito.\n\nPrivacidade: ${process.env.PRIVACY_EMAIL}`});
}
