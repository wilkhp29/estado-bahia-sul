import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
export default function InnerLayout({children,className=''}:{children:React.ReactNode;className?:string}){return <div className={`portal ${className}`.trim()}><SiteHeader/><main id="conteudo" tabIndex={-1} className="portal-main">{children}</main><SiteFooter/></div>;}
