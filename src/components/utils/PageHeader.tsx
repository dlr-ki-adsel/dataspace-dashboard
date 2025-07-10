import InfoDrawer from './InfoDrawer';




interface PageHeaderProps {
    title: string;
    info_json: Record<string, any>;
  }

const PageHeader: React.FC<PageHeaderProps> = ({ title, info_json }) => {
  return (
    <h1 style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      {title}
      <div style={{ position: 'relative', top: '-16px' }}>
        <InfoDrawer title={info_json.title} body={info_json.body} />
      </div>
    </h1>
  );
};

export default PageHeader;