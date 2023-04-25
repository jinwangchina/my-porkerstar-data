import "./PageHeader.css";

export const PageHeader = ( props: PageHeaderProps ) => {
    return (
        <header className="mdp-PageHeader">
            <h1>{props.title}</h1>
            {props.subTitle && <p>{props.subTitle}</p>}
        </header>
    );
};

export type PageHeaderProps = {
    title: string;
    subTitle?: string;
}
