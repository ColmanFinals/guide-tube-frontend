import Logo from '../assets/white_guidetube.png'

interface PageTopTitleProps {
    pageTitle: string;
}
const PageTopTitle: React.FC<PageTopTitleProps> = ({pageTitle}) => {
    return(
    <div className="flex justify-between items-center p-2 w-full" style={{background: '#171717'}}>
        <div> {pageTitle} </div>
        <img src={Logo} style={{width: 40, height: 40}}/>
    </div>
    );
}
export default PageTopTitle;