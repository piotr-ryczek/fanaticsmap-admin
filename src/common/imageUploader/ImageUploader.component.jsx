import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';

function ImageUploader(props) {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage]= useState(null);

  const {
    fieldId,
    onChange,
  } = props;

  const reader = useMemo(() => {
    const readerInstance = new FileReader()

    readerInstance.addEventListener('load', function () {
      const { result } = reader;
  
      setPreviewImage(result);
    }, false);

    return readerInstance;
  }, []);

  const handleChange = async (event) => {
    const { files } = event.target;
    const [file] = files;
  
    if (file) {
      reader.readAsDataURL(file);
    }

    onChange(file);
  }

  return (
    <Grid container spacing={2}>
      {previewImage && (
        <Grid item xs={12}>
          <img
            src={previewImage}
            alt=""
            height="100"
          />
        </Grid>
      )}
      
      <Grid item xs={12}>
        <FormLabel htmlFor={fieldId}>
          <Button variant="contained" color="primary" component="span">{t('global.chooseToUpload')}</Button>
          <input
            type="file"
            accept="image/*"
            id={fieldId}
            onChange={handleChange}
            className="hide"
          />
        </FormLabel>
      </Grid>
    </Grid>
  );
}

export default ImageUploader;
