import { ArchbaseJacksonParser } from "components/core/json";


export class ArchbaseQueryBuilderData {
  static getSaveFilterConfig(filter, version='v1') {
    let jsonFilter = ArchbaseJacksonParser.convertObjectToJson(filter);
    return {
      url: `${version}/filtro/`,
      method: 'post',
      data: jsonFilter
    };
  }

  static getRemoveFilterConfig(filter, version='v1') {
    return {
      url: `${version}/filtro/${filter.idFilter}`,
      method: 'delete'
    };
  }

  static getFilters(form, component, version='v1') {
    return {
      url: `${version}/filtro/findFilterByForm?form=${form}&component=${component}&fieldsToForceLazy=`,
      method: 'get'
    };
  }

  static configureDatasource(dataSource, version='v1') {
    dataSource.setAjaxPostConfigHandler(filter => {
      return ArchbaseQueryBuilderData.getSaveFilterConfig(filter,version);
    });
    dataSource.setValidatePostResponse(response => {
      return response.data !== undefined;
    });
    dataSource.setAjaxDeleteConfigHandler(filter => {
      return ArchbaseQueryBuilderData.getRemoveFilterConfig(filter,version);
    });
    dataSource.setValidateDeleteResponse(response => {
      return response.data !== undefined;
    });
    dataSource.setAjaxOpenConfigHandler((form,component,vers) => {
      return ArchbaseQueryBuilderData.getFilters(form,component,vers);
    });
  }

  static createDatasource(form, component, version='v1') {
    // let dataSource = new ArchbaseRemoteDataSource();
    // dataSource.setAjaxPostConfigHandler(filter => {
    //   return ArchbaseQueryBuilderData.getSaveFilterConfig(filter,version);
    // });
    // dataSource.setValidatePostResponse(response => {
    //   return response.data !== undefined;
    // });
    // dataSource.setAjaxDeleteConfigHandler(filter => {
    //   return ArchbaseQueryBuilderData.getRemoveFilterConfig(filter,version);
    // });
    // dataSource.setValidateDeleteResponse(response => {
    //   return response.data !== undefined;
    // });
    // dataSource.setAjaxOpenConfigHandler(() => {
    //   return ArchbaseQueryBuilderData.getFilters(form,component,version);
    // VER AQUI DEPOIS });
    return undefined;
  }


}
